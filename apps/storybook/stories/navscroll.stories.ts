import type { Meta, StoryObj } from "@storybook/html-vite";
import { navscroll, doc, type NavscrollArgs } from "@italia-daisy/recipes/components/navscroll";
import { example, describe } from "./helpers";

const meta: Meta<NavscrollArgs> = {
  title: "Componenti/Navscroll",
  tags: ["autodocs"],
  render: (args) => navscroll(args),
  args: {"title":"Indice della pagina","progress":true},
  argTypes: {},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<NavscrollArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Statico: Story = example(doc, "statico");
