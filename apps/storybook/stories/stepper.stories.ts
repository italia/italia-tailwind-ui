import type { Meta, StoryObj } from "@storybook/html-vite";
import { stepper, doc, type StepperArgs } from "@italia-daisy/recipes/components/stepper";
import { example, describe } from "./helpers";

const meta: Meta<StepperArgs> = {
  title: "Componenti/Stepper",
  tags: ["autodocs"],
  render: (args) => stepper(args),
  args: {"current":1,"header":"text","nav":"dots","confirmLabel":"Conferma"},
  argTypes: {"current":{"control":{"type":"number","min":0,"max":4}},"header":{"control":"inline-radio","options":["text","number","icon","steps"]},"nav":{"control":"inline-radio","options":["dots","progress","none"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<StepperArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Numeri: Story = example(doc, "numeri");
export const Icone: Story = example(doc, "icone");
export const DaisySteps: Story = example(doc, "daisy-steps");
export const Ultimo: Story = example(doc, "ultimo");
export const Scuro: Story = example(doc, "scuro");
export const Modulo: Story = example(doc, "modulo");
