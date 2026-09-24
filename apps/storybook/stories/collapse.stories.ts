import type { Meta, StoryObj } from "@storybook/html-vite";
import { collapse, doc, type CollapseArgs } from "@italia-daisy/recipes/components/collapse";
import { example, describe } from "./helpers";

const meta: Meta<CollapseArgs> = {
  title: "Componenti/Collapse",
  tags: ["autodocs"],
  render: (args) => collapse(args),
  args: {"label":"Mostra il contenuto","trigger":"button","variant":"primary","outline":false,"bordered":false,"open":false},
  argTypes: {"trigger":{"control":"inline-radio","options":["button","link"]},"variant":{"control":"select","options":["primary","secondary","success","danger","warning"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<CollapseArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Aperto: Story = example(doc, "aperto");
export const Riquadro: Story = example(doc, "riquadro");
export const Esclusivi: Story = example(doc, "esclusivi");
