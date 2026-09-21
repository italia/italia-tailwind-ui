import type { Meta, StoryObj } from "@storybook/html-vite";
import { callout, doc, type CalloutArgs } from "@italia-daisy/recipes/components/callout";
import { example, describe } from "./helpers";

const meta: Meta<CalloutArgs> = {
  title: "Componenti/Callout",
  tags: ["autodocs"],
  render: (args) => callout(args),
  args: {"variant": "default", "highlight": false, "bigText": false},
  argTypes: {"variant": {"control": "select", "options": ["default", "primary", "success", "warning", "danger"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<CalloutArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const BigText: Story = example(doc, "big-text");
export const Varianti: Story = example(doc, "varianti");
export const Highlight: Story = example(doc, "highlight");
export const Approfondimento: Story = example(doc, "approfondimento");
