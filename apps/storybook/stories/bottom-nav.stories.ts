import type { Meta, StoryObj } from "@storybook/html-vite";
import { bottomNav, doc, type BottomNavArgs } from "@italia-daisy/recipes/components/bottom-nav";
import { example, describe } from "./helpers";

const meta: Meta<BottomNavArgs> = {
  title: "Componenti/Bottom navigation",
  tags: ["autodocs"],
  render: (args) => bottomNav(args),
  args: {"label":"Navigazione principale","position":"static"},
  argTypes: {"position":{"control":"inline-radio","options":["static","fixed"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<BottomNavArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const CinqueVoci: Story = example(doc, "cinque-voci");
export const Scuro: Story = example(doc, "scuro");
