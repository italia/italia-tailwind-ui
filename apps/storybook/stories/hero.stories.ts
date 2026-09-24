import type { Meta, StoryObj } from "@storybook/html-vite";
import { hero, doc, type HeroArgs } from "@italia-daisy/recipes/components/hero";
import { example, describe } from "./helpers";

const meta: Meta<HeroArgs> = {
  title: "Componenti/Hero",
  tags: ["autodocs"],
  render: (args) => hero(args),
  args: {"category": "Titolo occhiello", "title": "Titolo della sezione", "text": "Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Dictum sit amet justo donec enim diam vulputate ut.", "ctaLabel": "Azione primaria", "image": "https://picsum.photos/seed/hero-italia/1600/700", "overlay": "dark", "center": false, "overlap": false, "small": false},
  argTypes: {"overlay": {"control": "select", "options": ["none", "neutral", "primary", "filter"]}, "headingLevel": {"control": "select", "options": [1, 2, 3]}},
  parameters: { layout: "fullscreen", docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<HeroArgs>;

export const Playground: Story = {};

export const Immagine: Story = example(doc, "immagine");
export const Testuale: Story = example(doc, "testuale");
export const Centrato: Story = example(doc, "centrato");
export const TestoImmagine: Story = example(doc, "testo-immagine");
export const OverlayPrimario: Story = example(doc, "overlay-primario");
export const OverlayFiltro: Story = example(doc, "overlay-filtro");
export const Piccolo: Story = example(doc, "piccolo");
export const Sovrapposto: Story = example(doc, "sovrapposto");
