import type { Meta, StoryObj } from "@storybook/html-vite";
import { tooltip, doc, type TooltipArgs } from "@italia-daisy/recipes/components/tooltip";
import { example, describe } from "./helpers";

const meta: Meta<TooltipArgs> = {
  title: "Componenti/Tooltip",
  tags: ["autodocs"],
  render: (args) => `<div class="flex justify-center py-12">${tooltip(args)}</div>`,
  args: {"text": "Testo del tooltip", "placement": "top", "color": "neutral", "open": false},
  argTypes: {"placement": {"control": "inline-radio", "options": ["top", "bottom", "left", "right"]}, "color": {"control": "select", "options": ["neutral", "primary", "secondary", "success", "warning", "danger", "info"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<TooltipArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Posizione: Story = example(doc, "posizione");
export const Aperto: Story = example(doc, "aperto");
export const Accessibile: Story = example(doc, "accessibile");
export const SuLink: Story = example(doc, "su-link");
