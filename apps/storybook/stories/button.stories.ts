import type { Meta, StoryObj } from "@storybook/html-vite";
import { button, doc, type ButtonArgs } from "@italia-daisy/recipes/components/button";
import { example, describe } from "./helpers";

const meta: Meta<ButtonArgs> = {
  title: "Componenti/Button",
  tags: ["autodocs"],
  render: (args) => button(args),
  args: {"label": "Pulsante", "variant": "primary", "size": "default", "outline": false, "block": false, "disabled": false},
  argTypes: {"variant": {"control": "select", "options": ["primary", "secondary", "success", "danger", "warning", "link"]}, "size": {"control": "select", "options": ["lg", "default", "xs"]}, "icon": {"control": "select", "options": ["it-star-full", "it-user", "it-arrow-right", "it-download"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {};

export const VariantiColore: Story = example(doc, "varianti-colore");
export const Disabilitato: Story = example(doc, "disabilitato");
export const Dimensioni: Story = example(doc, "dimensioni");
export const ConIcona: Story = example(doc, "con-icona");
export const IconaCerchiata: Story = example(doc, "icona-cerchiata");
export const Badge: Story = example(doc, "badge");
export const SfondoPrimario: Story = example(doc, "sfondo-primario");
export const Tipologie: Story = example(doc, "tipologie");
