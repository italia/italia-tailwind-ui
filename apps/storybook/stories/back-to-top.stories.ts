import type { Meta, StoryObj } from "@storybook/html-vite";
import { backToTop, doc, type BackToTopArgs } from "@italia-daisy/recipes/components/back-to-top";
import { example, describe } from "./helpers";

const meta: Meta<BackToTopArgs> = {
  title: "Componenti/Back to top",
  tags: ["autodocs"],
  render: (args) => backToTop(args),
  args: {"label":"Torna su","large":false,"inverse":false,"shadow":false,"position":"static"},
  argTypes: {"position":{"control":"inline-radio","options":["static","fixed"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<BackToTopArgs>;

export const Playground: Story = {};

export const Varianti: Story = example(doc, "varianti");
export const Fisso: Story = example(doc, "fisso");
