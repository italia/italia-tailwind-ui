import type { Meta, StoryObj } from "@storybook/html-vite";
import { dropdown, doc, type DropdownArgs } from "@italia-daisy/recipes/components/dropdown";
import { example, describe } from "./helpers";

const meta: Meta<DropdownArgs> = {
  title: "Componenti/Dropdown",
  tags: ["autodocs"],
  render: (args) => `<div class="h-64">${dropdown(args)}</div>`,
  args: {"label": "Apri dropdown", "variant": "primary", "size": "default", "align": "start", "surface": "base", "fullWidth": false, "disabled": false, "notch": true},
  argTypes: {"surface": {"control": "inline-radio", "options": ["base", "accent"]}, "variant": {"control": "select", "options": ["primary", "secondary", "success", "danger", "warning", "link"]}, "size": {"control": "select", "options": ["lg", "default", "xs"]}, "align": {"control": "select", "options": ["start", "end", "top", "top-end", "left", "right"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<DropdownArgs>;

export const Playground: Story = {};

export const Varianti: Story = example(doc, "varianti");
export const Posizionamento: Story = example(doc, "posizionamento");
export const VociAttive: Story = example(doc, "voci-attive");
export const VociDisabilitate: Story = example(doc, "voci-disabilitate");
export const Intestazioni: Story = example(doc, "intestazioni");
export const VociGrandi: Story = example(doc, "voci-grandi");
export const Icone: Story = example(doc, "icone");
export const TuttaLarghezza: Story = example(doc, "tutta-larghezza");
export const SfondoAccent: Story = example(doc, "sfondo-accent");
export const Azioni: Story = example(doc, "azioni");
