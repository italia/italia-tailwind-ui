import type { Meta, StoryObj } from "@storybook/html-vite";
import { chip, doc, type ChipArgs } from "@italia-daisy/recipes/components/chip";
import { example, describe } from "./helpers";

const meta: Meta<ChipArgs> = {
  title: "Componenti/Chip",
  tags: ["autodocs"],
  render: (args) => chip(args),
  args: {"label": "Etichetta", "variant": "primary", "size": "sm", "dismissable": false, "disabled": false},
  argTypes: {"variant": {"control": "select", "options": ["default", "primary", "secondary", "success", "danger", "warning"]}, "size": {"control": "select", "options": ["sm", "lg"]}, "icon": {"control": "select", "options": ["it-download", "it-upload", "it-star-full"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ChipArgs>;

export const Playground: Story = {};

export const Varianti: Story = example(doc, "varianti");
export const Link: Story = example(doc, "link");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Chiusura: Story = example(doc, "chiusura");
export const Disabilitata: Story = example(doc, "disabilitata");
export const Avatar: Story = example(doc, "avatar");
export const Icona: Story = example(doc, "icona");
