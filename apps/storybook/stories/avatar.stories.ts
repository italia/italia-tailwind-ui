import type { Meta, StoryObj } from "@storybook/html-vite";
import { avatar, doc, type AvatarArgs } from "@italia-daisy/recipes/components/avatar";
import { example, describe } from "./helpers";

const meta: Meta<AvatarArgs> = {
  title: "Componenti/Avatar",
  tags: ["autodocs"],
  render: (args) => avatar(args),
  args: {"initials":"MR","alt":"Mario Rossi","size":"lg","color":"default"},
  argTypes: {"size":{"control":"select","options":["xs","sm","md","lg","xl","xxl"]},"color":{"control":"inline-radio","options":["default","primary","secondary"]},"status":{"control":"select","options":["online","busy","away","offline"]},"icon":{"control":"select","options":["it-user","it-pa","it-mail"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<AvatarArgs>;

export const Playground: Story = {};

export const Immagine: Story = example(doc, "immagine");
export const Iniziali: Story = example(doc, "iniziali");
export const Icona: Story = example(doc, "icona");
export const Stato: Story = example(doc, "stato");
export const Link: Story = example(doc, "link");
export const Gruppo: Story = example(doc, "gruppo");
export const Testo: Story = example(doc, "testo");
export const Menu: Story = example(doc, "menu");
