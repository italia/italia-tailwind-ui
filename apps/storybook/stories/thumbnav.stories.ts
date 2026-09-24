import type { Meta, StoryObj } from "@storybook/html-vite";
import { thumbnav, doc, type ThumbnavArgs } from "@italia-daisy/recipes/components/thumbnav";
import { example, describe } from "./helpers";

const meta: Meta<ThumbnavArgs> = {
  title: "Componenti/Thumbnav",
  tags: ["autodocs"],
  render: (args) => thumbnav(args),
  args: {"label":"Miniature","size":"md","vertical":false},
  argTypes: {"size":{"control":"inline-radio","options":["sm","md","lg"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ThumbnavArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Verticale: Story = example(doc, "verticale");
export const Galleria: Story = example(doc, "galleria");
