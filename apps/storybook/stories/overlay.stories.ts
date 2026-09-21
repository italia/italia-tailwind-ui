import type { Meta, StoryObj } from "@storybook/html-vite";
import { overlay, doc, type OverlayArgs } from "@italia-daisy/recipes/components/overlay";
import { example, describe } from "./helpers";

const meta: Meta<OverlayArgs> = {
  title: "Componenti/Overlay",
  tags: ["autodocs"],
  render: (args) => overlay(args),
  args: {"text": "Titolo del contenuto", "tone": "primary", "height": "band", "onHover": false},
  argTypes: {"tone": {"control": "inline-radio", "options": ["primary", "black"]}, "height": {"control": "inline-radio", "options": ["band", "full"]}, "icon": {"control": "select", "options": ["it-zoom-in", "it-video", "it-camera", "it-external-link"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<OverlayArgs>;

export const Playground: Story = {};

export const Pannello: Story = example(doc, "pannello");
export const Altezza: Story = example(doc, "altezza");
export const Hover: Story = example(doc, "hover");
export const Dimmer: Story = example(doc, "dimmer");
export const DimmerPrimario: Story = example(doc, "dimmer-primario");
export const DimmerAzioni: Story = example(doc, "dimmer-azioni");
