// src/components/deals/search-filters.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const filterSchema = z.object({
  location: z.string().optional(),
  priceRange: z.array(z.number()).length(2).optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  category: z.string().optional(),
});

export function SearchFilters({ rawSearchParams = {}, categories = [] }) {
  const router = useRouter();
  const pathname = usePathname();

  // Process the raw search params in the client component
  const processedParams = {
    location: rawSearchParams.location || "",
    priceMin: rawSearchParams.priceMin
      ? parseInt(rawSearchParams.priceMin, 10)
      : 0,
    priceMax: rawSearchParams.priceMax
      ? parseInt(rawSearchParams.priceMax, 10)
      : 5000,
    startDate: rawSearchParams.startDate
      ? new Date(rawSearchParams.startDate)
      : null,
    endDate: rawSearchParams.endDate ? new Date(rawSearchParams.endDate) : null,
    category: rawSearchParams.category || "",
    sort: rawSearchParams.sort || "recommended",
  };

  const [priceRange, setPriceRange] = useState([
    processedParams.priceMin,
    processedParams.priceMax,
  ]);

  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      location: processedParams.location,
      priceRange: [processedParams.priceMin, processedParams.priceMax],
      startDate: processedParams.startDate,
      endDate: processedParams.endDate,
      category: processedParams.category,
    },
  });

  // Build query string from form values
  const buildQueryString = (values) => {
    const params = new URLSearchParams();

    if (values.location) {
      params.append("location", values.location);
    }

    if (values.priceRange && values.priceRange[0] > 0) {
      params.append("priceMin", values.priceRange[0]);
    }

    if (values.priceRange && values.priceRange[1] < 5000) {
      params.append("priceMax", values.priceRange[1]);
    }

    if (values.startDate) {
      params.append("startDate", format(values.startDate, "yyyy-MM-dd"));
    }

    if (values.endDate) {
      params.append("endDate", format(values.endDate, "yyyy-MM-dd"));
    }

    if (values.category) {
      params.append("category", values.category);
    }

    // Preserve sorting parameter if exists
    if (rawSearchParams.sort) {
      params.append("sort", rawSearchParams.sort);
    }

    return params.toString();
  };

  const onSubmit = (values) => {
    // Apply price range from state
    values.priceRange = priceRange;

    // Navigate with new filter params
    const queryString = buildQueryString(values);
    router.push(`${pathname}?${queryString}`);
  };

  const handleReset = () => {
    form.reset({
      location: "",
      priceRange: [0, 5000],
      startDate: null,
      endDate: null,
      category: "",
    });

    setPriceRange([0, 5000]);
    router.push(pathname);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Deals</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="City or country"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Price Range</Label>
              <Slider
                min={0}
                max={5000}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() ||
                          (form.getValues().startDate &&
                            date < form.getValues().startDate)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-2 pt-2">
              <Button type="submit">Apply Filters</Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
