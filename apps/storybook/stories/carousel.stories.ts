import type { Meta, StoryObj } from "@storybook/html-vite";
import { carousel, doc, type CarouselArgs } from "@italia-daisy/recipes/components/carousel";
import { example, describe } from "./helpers";

const meta: Meta<CarouselArgs> = {
  title: "Componenti/Carousel",
  tags: ["autodocs"],
  render: (args) => carousel(args),
  args: {"title":"Notizie in evidenza","type":"cards","controls":"css"},
  argTypes: {"type":{"control":"inline-radio","options":["cards","image","peek"]},"controls":{"control":"inline-radio","options":["css","links","none"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<CarouselArgs>;

export const Playground: Story = {};

export const Card: Story = example(doc, "card");
export const Immagini: Story = example(doc, "immagini");
export const Anteprima: Story = example(doc, "anteprima");
export const Link: Story = example(doc, "link");
