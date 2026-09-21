import type { Meta, StoryObj } from "@storybook/html-vite";
import { modal, doc, type ModalArgs } from "@italia-daisy/recipes/components/modal";
import { example, describe } from "./helpers";

const meta: Meta<ModalArgs> = {
  title: "Componenti/Modal",
  tags: ["autodocs"],
  render: (args) => modal(args),
  args: {"title": "Titolo modale", "triggerLabel": "Lancia la demo della modale", "trigger": "command", "size": "default", "position": "center", "variant": "default", "scrollable": false, "staticBackdrop": false, "hideCloseButton": false},
  argTypes: {"trigger": {"control": "inline-radio", "options": ["command", "target", "checkbox"]}, "size": {"control": "select", "options": ["sm", "default", "lg", "xl"]}, "position": {"control": "inline-radio", "options": ["center", "left", "right"]}, "variant": {"control": "select", "options": ["default", "alert", "popconfirm", "link-list"]}, "icon": {"control": "select", "options": ["it-warning-circle", "it-info-circle", "it-check-circle", "it-error"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ModalArgs>;

export const Playground: Story = {};

export const Apertura: Story = example(doc, "apertura");
export const Chiusura: Story = example(doc, "chiusura");
export const Icona: Story = example(doc, "icona");
export const Footer: Story = example(doc, "footer");
export const LinkList: Story = example(doc, "link-list");
export const Popconfirm: Story = example(doc, "popconfirm");
export const Scroll: Story = example(doc, "scroll");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Posizione: Story = example(doc, "posizione");
export const BackdropStatico: Story = example(doc, "backdrop-statico");
