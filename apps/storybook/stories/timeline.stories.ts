import type { Meta, StoryObj } from "@storybook/html-vite";
import { timeline, doc, type TimelineArgs } from "@italia-daisy/recipes/components/timeline";
import { example, describe } from "./helpers";

const meta: Meta<TimelineArgs> = {
  title: "Componenti/Timeline",
  tags: ["autodocs"],
  render: (args) => timeline(args),
  args: {"compact":false,"nowLabel":"Oggi"},
  argTypes: {},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<TimelineArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Compatta: Story = example(doc, "compatta");
export const SfondoPrimario: Story = example(doc, "sfondo-primario");
