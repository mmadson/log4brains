import React from "react";
import Head from "next/head";
import {Markdown, MarkdownToc, TwoColContent} from "../../components";
// eslint-disable-next-line import/no-cycle
import { ConnectedAdrBrowserLayout } from "../../layouts";

export type IndexSceneProps = {
  projectName: string;
  createAdrLink: string;
  markdown: string;
  l4bVersion: string;
};

export function IndexScene({ projectName, markdown }: IndexSceneProps) {

  const [mdContent, setMdContent] = React.useState<
    React.ReactElement | undefined
  >(undefined);

  return (
    <>
      <Head>
        <title>Architecture knowledge base of {projectName}</title>
        <meta
          name="description"
          content={`This architecture knowledge base contains all the Architecture Decision Records (ADR) of the ${projectName} project`}
        />
      </Head>
      <TwoColContent rightColContent={<MarkdownToc content={mdContent} levelStart={2} />}>
        <Markdown onCompiled={setMdContent}>
          {markdown}
        </Markdown>
      </TwoColContent>
    </>
  );
}

IndexScene.getLayout = (scene: JSX.Element, sceneProps: IndexSceneProps) => (
  <ConnectedAdrBrowserLayout {...sceneProps}>{scene}</ConnectedAdrBrowserLayout>
);
