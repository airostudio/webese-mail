import { NextRequest, NextResponse } from "next/server";

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

async function upsertVercelEnvVar(
  token: string,
  projectId: string,
  teamId: string | undefined,
  key: string,
  value: string
) {
  const baseUrl = `https://api.vercel.com/v10/projects/${projectId}/env`;
  const queryParams = teamId ? `?teamId=${teamId}` : "";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const createRes = await fetch(`${baseUrl}${queryParams}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: ["production", "preview", "development"],
    }),
  });

  if (createRes.ok) return; // Created successfully

  // Vercel returns 409 OR 400 with ENV_CONFLICT when the variable already exists
  const createBody = await createRes.json().catch(() => ({}));
  const isConflict =
    createRes.status === 409 ||
    (createRes.status === 400 && createBody?.error?.code === "ENV_CONFLICT");

  if (!isConflict) {
    throw new Error(
      `Failed to create ${key} (${createRes.status}): ${JSON.stringify(createBody)}`
    );
  }

  // Variable already exists — list to get its id, then PATCH
  const listRes = await fetch(`${baseUrl}${queryParams}`, { headers });
  if (!listRes.ok) {
    const body = await listRes.text();
    throw new Error(`Failed to list env vars (${listRes.status}): ${body}`);
  }
  const listData = await listRes.json();
  const existing = listData.envs?.find((e: { key: string }) => e.key === key);
  if (!existing) {
    throw new Error(`Env var ${key} not found after conflict response`);
  }

  const patchRes = await fetch(`${baseUrl}/${existing.id}${queryParams}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ value, type: "encrypted" }),
  });
  if (!patchRes.ok) {
    const body = await patchRes.text();
    throw new Error(`Failed to update ${key} (${patchRes.status}): ${body}`);
  }
}

async function triggerRedeployment(
  token: string,
  projectId: string,
  teamId: string | undefined
) {
  const queryParams = teamId ? `?teamId=${teamId}` : "";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Get the latest deployment to redeploy from it
  const deploymentsRes = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1${teamId ? `&teamId=${teamId}` : ""}`,
    { headers }
  );

  if (!deploymentsRes.ok) {
    throw new Error(`Failed to fetch deployments: ${deploymentsRes.statusText}`);
  }

  const deploymentsData = await deploymentsRes.json();
  const latestDeployment = deploymentsData.deployments?.[0];

  if (!latestDeployment) {
    // No existing deployment — skip redeployment trigger
    return { skipped: true, reason: "No existing deployment found" };
  }

  const redeployRes = await fetch(
    `https://api.vercel.com/v13/deployments${queryParams}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: latestDeployment.name,
        deploymentId: latestDeployment.uid,
        target: "production",
        gitSource: latestDeployment.meta?.githubCommitSha
          ? {
              type: "github",
              sha: latestDeployment.meta.githubCommitSha,
              repoId: latestDeployment.meta.githubRepoId,
            }
          : undefined,
      }),
    }
  );

  if (!redeployRes.ok) {
    const body = await redeployRes.text();
    throw new Error(`Failed to trigger redeployment (${redeployRes.status}): ${body}`);
  }

  return redeployRes.json();
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailSettings = await request.json();

    // Validate required fields
    const required: (keyof EmailSettings)[] = [
      "smtpHost",
      "smtpPort",
      "smtpUser",
      "smtpPassword",
      "fromEmail",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const vercelToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    if (!vercelToken || !projectId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing Vercel credentials. Add VERCEL_API_TOKEN and VERCEL_PROJECT_ID to your environment variables.",
        },
        { status: 500 }
      );
    }

    // Map form fields to env var names
    const envVars: Record<string, string> = {
      SMTP_HOST: body.smtpHost,
      SMTP_PORT: body.smtpPort,
      SMTP_USER: body.smtpUser,
      SMTP_PASSWORD: body.smtpPassword,
      EMAIL_FROM: body.fromEmail,
      EMAIL_FROM_NAME: body.fromName || body.fromEmail,
    };

    // Upsert all env vars
    for (const [key, value] of Object.entries(envVars)) {
      await upsertVercelEnvVar(vercelToken, projectId, teamId, key, value);
    }

    // Trigger redeployment
    let redeployResult;
    try {
      redeployResult = await triggerRedeployment(vercelToken, projectId, teamId);
    } catch (redeployErr) {
      // Non-fatal: env vars were saved, redeployment failed
      return NextResponse.json({
        success: true,
        message:
          "Email settings saved successfully. Note: automatic redeployment could not be triggered — please redeploy manually in the Vercel dashboard.",
        details: String(redeployErr),
      });
    }

    const redeployMessage =
      redeployResult?.skipped
        ? " Redeployment skipped (no existing deployment found)."
        : " Redeployment triggered successfully.";

    return NextResponse.json({
      success: true,
      message: `Email settings saved!${redeployMessage}`,
    });
  } catch (error) {
    console.error("Error updating email settings:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save settings — see details below.",
        details: detail,
      },
      { status: 500 }
    );
  }
}
