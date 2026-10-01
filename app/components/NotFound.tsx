import ContentPanel from "~/components/ContentPanel";
import ElttlEmblem from "~/components/icons/ElttlEmblem";
import classNames from "classnames";
import {buttonPrimaryClassNames} from "~/styles/ui-classes";
import LinkButton from "~/components/LinkButton";
import {Button} from "@headlessui/react";

export default function NotFound ({ message, details, stack, navigate }) {
    return (
    <main className="p-4 container mx-auto flex flex-col gap-4 justify-center items-center h-screen">
      <ContentPanel extraClassNames={'flex flex-col gap-4 items-center'}>
        <div className={'mb-4'}>
          <ElttlEmblem width={100}/>
        </div>
        <h1 className='text-4xl font-semibold'>{message}</h1>
        <p className={'text-lg'}>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
        )}
        <div className={'flex flex-col sm:flex-row gap-6 mt-6'}>
          <Button className={classNames({
            [buttonPrimaryClassNames]: true,
            'px-6 cursor-pointer': true
          })} onClick={() => navigate(-1)}>Back</Button>
          <LinkButton to={"/"} theme={'secondary'} className={'px-6'}>Home</LinkButton>
        </div>
      </ContentPanel>
    </main>
  );
}
