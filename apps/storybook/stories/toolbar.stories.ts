import type { Meta, StoryObj } from "@storybook/html-vite";
import { toolbar, doc, type ToolbarArgs } from "@italia-daisy/recipes/components/toolbar";
import { example, describe } from "./helpers";

const meta: Meta<ToolbarArgs> = {
  title: "Componenti/Toolbar",
  tags: ["autodocs"],
  render: (args) => toolbar(args),
  decorators: [(story) => `<div class="h-56">${story()}</div>`],
  args: {"size":"md","vertical":false,"label":"Barra degli strumenti"},
  argTypes: {"size":{"control":"inline-radio","options":["lg","md","sm"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ToolbarArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Verticale: Story = example(doc, "verticale");
export const SfondoPrimario: Story = example(doc, "sfondo-primario");
