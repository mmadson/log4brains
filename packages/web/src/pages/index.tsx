import { GetStaticProps } from "next";
import { getIndexPageMarkdown, getLog4brainsInstance } from "../lib/core-api";
import { getConfig } from "../lib/next";
import { IndexScene, IndexSceneProps } from "../scenes";
import { toAdrLight } from "../types";

export default IndexScene;

export const getStaticProps: GetStaticProps<IndexSceneProps> = async () => {
  return {
    props: {
      projectName: getLog4brainsInstance().config.project.name,
      createAdrLink: getLog4brainsInstance().config.project.createAdrLink,
      adrs: (await getLog4brainsInstance().searchAdrs()).map(toAdrLight), // For a faster 1st load and SEO
      markdown: await getIndexPageMarkdown(),
      l4bVersion: getConfig().serverRuntimeConfig.VERSION,
      repositoryUrl: getLog4brainsInstance().config.project.repository?.url ?? "#",
    },
    revalidate: 1
  };
};
