import type { Meta, StoryObj } from "@storybook/html-vite";
import { sticky, doc, type StickyArgs } from "@italia-daisy/recipes/components/sticky";
import { example, describe } from "./helpers";

const meta: Meta<StickyArgs> = {
  title: "Componenti/Sticky",
  tags: ["autodocs"],
  render: (args) => sticky(args),
  args: {"edge":"top","offset":"none","stuckShadow":true},
  argTypes: {"edge":{"control":"inline-radio","options":["top","bottom"]},"offset":{"control":"select","options":["none","sm","md","lg"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<StickyArgs>;

export const Playground: Story = {};

export const Barra: Story = example(doc, "barra");
export const BarraAzioni: Story = example(doc, "barra-azioni");
export const Laterale: Story = example(doc, "laterale");
