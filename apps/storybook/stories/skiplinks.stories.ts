import type { Meta, StoryObj } from "@storybook/html-vite";
import { skiplinks, doc, type SkiplinksArgs } from "@italia-daisy/recipes/components/skiplinks";
import { example, describe } from "./helpers";

const meta: Meta<SkiplinksArgs> = {
  title: "Componenti/Skiplinks",
  tags: ["autodocs"],
  render: (args) => skiplinks(args),
  args: {"visible":true},
  argTypes: {},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<SkiplinksArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Visibili: Story = example(doc, "visibili");
