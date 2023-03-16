import { AdrDto } from "@madm4ttus3r/l4bcore";

export type Adr = Omit<AdrDto, "supersededBy" | "body"> & {
  supersededBy: AdrLight | null;
  body: { enhancedMdx: string };
};

export type AdrLight = Pick<
  Adr,
  "slug" | "package" | "title" | "status" | "creationDate" | "publicationDate" | "repository"
>;

export function toAdrLight(adr: AdrDto | Adr | AdrLight): AdrLight {
  return {
    slug: adr.slug,
    package: adr.package,
    title: adr.title,
    status: adr.status,
    creationDate: adr.creationDate,
    publicationDate: adr.publicationDate,
    repository: {
      provider: adr.repository?.provider as unknown as string,
      url: adr.repository?.url as unknown as string,
      viewUrl: adr.repository?.viewUrl as unknown as string
    }
  };
}

export function toAdr(dto: AdrDto, superseder?: AdrLight): Adr {
  if (dto.supersededBy && !superseder) {
    throw new Error("You forgot to pass the superseder");
  }
  if (superseder && superseder.slug !== dto.supersededBy) {
    throw new Error(
      "The given superseder does not match the `supersededBy` field"
    );
  }

  return {
    ...dto,
    supersededBy: superseder ? toAdrLight(superseder) : null,
    body: {
      enhancedMdx: dto.body.enhancedMdx
    }
  };
}
