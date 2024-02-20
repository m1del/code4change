import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FadeIn } from "../Animation/FadeIn";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useContext } from "react";
import OptionContext from "../../context/OptionContext";

const FormSchema = z
  .object({
    type_workout: z.string(),
    num_days: z.coerce
      .number()
      .gt(0, "Number must be greater than 0")
      .lte(7, "Number must be less than or equal to 7"),
    custom_workout: z
      .string()
      .max(30, "Custom workout must be less than 30 characters"),
    notes: z.string().max(100, "Notes must be less than 100 characters"),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (!data.type_workout && !data.custom_workout) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["type_workout"],
        message: "Need to choose or write out a workout type.",
      });
    }
  });

export default function Options() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { level, setOptions } = useContext(OptionContext);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      num_days: 0,
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    setOptions({
      level: level,
      goal: values.custom_workout || values.type_workout || "",
      num_days: values.num_days || 3,
      notes: values.notes || "",
      setOptions,
    });

    navigate({
      pathname: "/test",
    });

    //  const response = await sendWorkoutPlanRequest(difficulty, values.type_workout, values.num_days);
    //  console.log(response['choices'][0]['message']['content'])
  }

  function onBack() {
    navigate({
      pathname: "/",
    });
  }

  return (
    <div className="flex flex-col w-[65%] sm:w-[40%] h-screen justify-center pb-36">
      <FadeIn direction="none">
        <h3 className="text-2xl sm:text-3xl mb-5">Tell us a bit more:</h3>
      </FadeIn>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="type_workout"
            render={({ field }) => (
              <FadeIn delay={0.35} direction="none" width="100%">
                <FormItem>
                  <FormLabel className="text-lg">Pick a Goal</FormLabel>
                  <FadeIn direction="left" delay={0.25} width="100%">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a workout type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Weightlifting">
                          Weightlifting
                        </SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Calisthenics">
                          Calisthenics
                        </SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                      </SelectContent>
                    </Select>
                  </FadeIn>
                  <FormMessage />
                </FormItem>
              </FadeIn>
            )}
          />
          <FormField
            control={form.control}
            name="custom_workout"
            render={({ field }) => (
              <FadeIn delay={0.35} direction="none" width="100%">
                <FormItem>
                  <FormDescription>(Or type a custom one here)</FormDescription>
                  <FadeIn delay={0.45} direction="left" width="100%">
                    <Input type="string" {...field} />
                  </FadeIn>
                  <FormMessage />
                </FormItem>
              </FadeIn>
            )}
          />
          <FadeIn delay={0.55} direction="none" width="100%">
            <FormField
              control={form.control}
              name="num_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Number of Gym Days</FormLabel>
                  <FadeIn delay={0.65} direction="left" width="100%">
                    <Input type="number" {...field} />
                  </FadeIn>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FadeIn>

          <FadeIn delay={0.75} direction="none" width="100%">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Notes</FormLabel>
                  <FormControl>
                    <FadeIn delay={0.85} direction="left" width="100%">
                      <Textarea
                        placeholder="Write any notes that may affect the exercises you can do. Example: 'I have a bad back'"
                        className="resize-none"
                        {...field}
                      />
                    </FadeIn>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FadeIn>
          <FadeIn direction="none">
            <div className="w-full flex md:flex-row gap-6 md:gap-8 flex-col justify-center">
              <Button
                size="lg"
                onClick={() => onBack()}
                className="text-xl border-2"
              >
                Go Back
              </Button>
              <Button size="lg" className="text-xl border-2">
                Submit
              </Button>
            </div>
          </FadeIn>
        </form>
      </Form>
    </div>
  );
}
