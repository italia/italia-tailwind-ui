import type { Meta, StoryObj } from "@storybook/html-vite";
import { alert, doc, type AlertArgs } from "@italia-daisy/recipes/components/alert";
import { example, describe } from "./helpers";

const meta: Meta<AlertArgs> = {
  title: "Componenti/Alert",
  tags: ["autodocs"],
  render: (args) => alert(args),
  args: {"variant": "primary", "dismissible": false},
  argTypes: {"variant": {"control": "select", "options": ["primary", "secondary", "success", "warning", "danger"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<AlertArgs>;

export const Playground: Story = {};

export const Esempi: Story = example(doc, "esempi");
export const LinkEvidenziato: Story = example(doc, "link-evidenziato");
export const ContenutoAggiuntivo: Story = example(doc, "contenuto-aggiuntivo");
export const Chiusura: Story = example(doc, "chiusura");
