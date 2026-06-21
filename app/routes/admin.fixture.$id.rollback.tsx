import {getDbFromContext} from "~/db-context.server";
import fulfillFixture from "~/services/fulfillFixture.service.server";

export async function action({ request, context, params }: Route.ActionArgs) {
  const db = getDbFromContext(context);
  const { id } = params

  if (!id) {
    return Response.json(
      { ok: false, message: "Missing fixture id" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const encounterStructJson = formData.get("encounterStruct");

    if (!encounterStructJson || typeof encounterStructJson !== "string") {
      return Response.json(
        { ok: false, message: "Missing encounterStruct" },
        { status: 400 }
      );
    }

    const encounterStruct = JSON.parse(encounterStructJson);

    await fulfillFixture(db, Number(id), encounterStruct, true);

    return Response.json(
      { ok: true, message: `Fixture ${id} rolled back successfully!` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rolling back fixture:", error);

    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Rollback failed",
      },
      { status: 422 } // or 500 if you prefer treating all as server errors
    );
  }
}
