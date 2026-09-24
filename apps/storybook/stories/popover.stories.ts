import type { Meta, StoryObj } from "@storybook/html-vite";
import { popover, doc, type PopoverArgs } from "@italia-daisy/recipes/components/popover";
import { example, describe } from "./helpers";

const meta: Meta<PopoverArgs> = {
  title: "Componenti/Popover",
  tags: ["autodocs"],
  render: (args) => popover(args),
  decorators: [(story) => `<div class="flex justify-center py-24">${story()}</div>`],
  args: {"title":"Titolo del popover","triggerLabel":"Apri popover","placement":"bottom","closeButton":false},
  argTypes: {"placement":{"control":"inline-radio","options":["top","bottom","left","right"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<PopoverArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Posizione: Story = example(doc, "posizione");
export const Chiusura: Story = example(doc, "chiusura");
export const Icona: Story = example(doc, "icona");
