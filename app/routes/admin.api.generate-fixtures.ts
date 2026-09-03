import type {Route} from "./+types/admin.api.generate-fixtures";
import {getDbFromContext} from "~/db-context.server";
import {requireAdmin} from "~/auth/session.server";
import generateFixtures from "~/services/generateFixtures.service.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request);

  const db = getDbFromContext(context);

  const isSuccess = await generateFixtures(db);

  if (!isSuccess) {
    return Response.json({
      message: 'Failed to generate fixtures'
    }, { status: 500 });
  }

  return Response.json({
    message: 'Fixtures generated successfully',
  });
}
