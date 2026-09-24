import type { Meta, StoryObj } from "@storybook/html-vite";
import { notification, doc, type NotificationArgs } from "@italia-daisy/recipes/components/notification";
import { example, describe } from "./helpers";

const meta: Meta<NotificationArgs> = {
  title: "Componenti/Notification",
  tags: ["autodocs"],
  render: (args) => notification(args),
  args: {"title":"Domanda inviata","text":"Riceverai una conferma via email.","variant":"success","dismissible":true},
  argTypes: {"variant":{"control":"select","options":["default","success","error","info","warning"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<NotificationArgs>;

export const Playground: Story = {};

export const Varianti: Story = example(doc, "varianti");
export const SoloTitolo: Story = example(doc, "solo-titolo");
export const Chiusura: Story = example(doc, "chiusura");
export const Posizioni: Story = example(doc, "posizioni");
