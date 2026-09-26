import MainHeading from "~/components/MainHeading";
import { buildMeta } from "~/constants/MetaData";
import { Link } from "react-router";
import classNames from "classnames";
import { buttonPrimaryStyles, linkStyles } from "~/styles/ui-classes";
import { BiSolidVideos } from "react-icons/bi";
import ContentBody from "~/components/ContentBody";

export function meta({}) {
  return buildMeta({
    title: "Service Rules",
    description: ``,
  });
}

export default function _frontServiceRules() {
  return (
    <ContentBody isNarrow>
      <section className="space-y-12">
        <div className="space-y-4">
          <MainHeading name="Table Tennis Service Rules" />
          <p>
            Here are the essential service rules every player must follow in
            league play.
          </p>
          <p>
            <strong className={"text-stone-600"}>Note:</strong> There are also
            special rules for wheelchair receivers, please familiarise yourself
            with them{" "}
            <Link
              className={linkStyles.join(" ")}
              to="#service-rules-wheelchair"
            >
              below
            </Link>
            .
          </p>

          <div
            className={
              "border p-6 my-4 sm:flex rounded gap-8 items-center border-secondary-500"
            }
          >
            <p>
              More of a visual learner? Jump straight to a video explanation of
              the rules.
            </p>
            <div className={"flex justify-end mt-4 sm:mt-0"}>
              <Link
                to="#service-rules-video"
                className={classNames(
                  buttonPrimaryStyles.join(" "),
                  "px-4 py-2 flex gap-2 items-center text-nowrap",
                )}
              >
                <BiSolidVideos />
                <span>Jump to Video</span>
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-6">Key to a Good Serve</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className={"text-stone-600"}>Visible ball toss:</strong>{" "}
              The ball must be thrown near vertically and clearly upward from
              the palm.
            </li>
            <li>
              <strong className={"text-stone-600"}>
                Contact behind the end line:
              </strong>{" "}
              Strike the ball behind the end line and above the playing surface.
            </li>
            <li>
              <strong className={"text-stone-600"}>No hidden serves:</strong>{" "}
              The opponent must see the ball at all times; no obstruction by the
              free arm or body.
            </li>
            <li>
              <strong className={"text-stone-600"}>Stationary ball:</strong> The
              serve must begin with the ball resting freely on an open palm.
            </li>
            <li>
              <strong className={"text-stone-600"}>Upward toss:</strong> Toss
              the ball at least 16cm without excessive forward/backward angle.
            </li>
            <li>
              <strong className={"text-stone-600"}>No pre‑spin:</strong> You
              cannot add spin with your fingers before the toss.
            </li>
            <li>
              <strong className={"text-stone-600"}>Consistency:</strong> A
              clear, visible motion avoids faults and disputes.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Why These Rules Exist</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className={"text-stone-600"}>Fairness:</strong> Both
              players must clearly see the ball during the serve.
            </li>
            <li>
              <strong className={"text-stone-600"}>Transparency:</strong>{" "}
              Prevents deceptive hidden‑spin techniques.
            </li>
            <li>
              <strong className={"text-stone-600"}>Standardisation:</strong>{" "}
              Ensures league matches follow ITTF‑aligned expectations.
            </li>
          </ul>
        </div>

        <div id="service-rules-video" className="space-y-4">
          <h2 className="text-2xl font-semibold">Watch the Full Explanation</h2>
          <p>
            After reading the rules above, take a look at this breakdown from
            PingSkills for a visual demonstration:
          </p>

          <div className="aspect-video w-full max-w-3xl mt-8">
            <iframe
              className="w-full h-full rounded-lg shadow"
              src="https://www.youtube.com/embed/s9ELscafqVs"
              title="Table Tennis Service Rules You NEED to Know!"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <hr />

        <div className="space-y-4" id="service-rules-wheelchair">
          <h2 className="text-2xl font-semibold mt-8">
            Rules for Wheelchair Receivers
          </h2>
          <p>
            When serving to a receiver in a wheelchair in table tennis, the
            service results in a let under specific conditions where the
            restricted reach of the wheelchair user makes certain trajectories
            unfair.
          </p>
          <p>
            A rally is called a let if an otherwise correct service touched the
            receiver's court and then:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Returns toward the net after the ball has bounced</li>
            <li>Comes to rest on the receiver's court</li>
            <li>
              Leaves the receiver's court via either sideline in singles play
              after touching the court, regardless of how many bounces
            </li>
          </ul>

          <p>
            An exception to the "Let" rule is an early strike by the receiver -
            this is where if the ball is traveling towards a sideline in singles
            and the receiver strikes it BEFORE it crosses the sideline or takes
            a second bounce on their side. the service is GOOD and no let is
            called.
          </p>

          <p>
            There are also special rules for doubles play involving a wheelchair
            player. These are explained clearly in the following video:
          </p>

          <div className="aspect-video w-full max-w-3xl mt-8">
            <iframe
              className="w-full h-full rounded-lg shadow"
              src="https://www.youtube.com/embed/eN-AV4pLlYg?si=AXhwjBkn-T6wJstC"
              title="Adaptive rules for wheelchair players in table tennis"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </ContentBody>
  );
}
