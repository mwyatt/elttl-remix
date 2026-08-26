import type {Route} from "./+types/api.score-update";

export async function action({ request, context }: Route.ActionArgs) {
  // Read JSON body from the POST request
  const body = await request.json();

  const { passcode, scorecardData } = body;

  // Example: scorecardData.encounterStruct
  // Example: scorecardData.playerSignaturesByTeamId[teamId]

  // Do your DB update here using context.env or your db helpers

  return Response.json({
    ok: true,
    received: {
      passcode,
      scorecardData
    }
  });
}
