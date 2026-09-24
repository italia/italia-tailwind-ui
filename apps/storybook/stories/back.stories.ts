import type { Meta, StoryObj } from "@storybook/html-vite";
import { back, doc, type BackArgs } from "@italia-daisy/recipes/components/back";
import { example, describe } from "./helpers";

const meta: Meta<BackArgs> = {
  title: "Componenti/Back",
  tags: ["autodocs"],
  render: (args) => back(args),
  args: {"label":"Torna indietro","href":"#","asButton":false,"iconOnly":false},
  argTypes: {},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<BackArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Pulsante: Story = example(doc, "pulsante");
export const InPagina: Story = example(doc, "in-pagina");
