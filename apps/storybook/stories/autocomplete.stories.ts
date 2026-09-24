import type { Meta, StoryObj } from "@storybook/html-vite";
import { autocomplete, doc, type AutocompleteArgs } from "@italia-daisy/recipes/components/autocomplete";
import { example, describe } from "./helpers";

const meta: Meta<AutocompleteArgs> = {
  title: "Componenti/Autocomplete",
  tags: ["autodocs"],
  render: (args) => autocomplete(args),
  args: {"label":"Comune","placeholder":"Inizia a scrivere","size":"default","required":false,"disabled":false},
  argTypes: {"size":{"control":"inline-radio","options":["sm","default","lg"]},"icon":{"control":"select","options":["it-search","it-map-marker","it-pa"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<AutocompleteArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const SenzaIcona: Story = example(doc, "senza-icona");
export const Ricerca: Story = example(doc, "ricerca");
export const Disabilitato: Story = example(doc, "disabilitato");
