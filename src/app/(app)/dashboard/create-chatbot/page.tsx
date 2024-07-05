"use client";

import { useEffect, useState } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-uploader";
import { Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createChatbotSchema } from "@/schemas/createChatbotSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ApiResponseType } from "@/types/ApiResponse";
import { FileSvgDraw } from "@/components/icons/Icons";
import countCharacters from "@/lib/characterCount.js";


const FileUploaderTest = () => {

  const [characterCount, setCharacterCount] = useState<number>(0);
  const [files, setFiles] = useState<File[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof createChatbotSchema>>({
    resolver: zodResolver(createChatbotSchema),
    defaultValues: {
      name: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (files) {
      setCharacterCount(0);
      files.forEach(async (file) => {
        const count = await countCharacters(file);
        setCharacterCount(characterCount => characterCount + (count ?? 0));
      })
    }
    else {
      setCharacterCount(0)
    }
  }, [files])

  const onSubmit = async (data: z.infer<typeof createChatbotSchema>) => {
    if (!files) {
      toast({
        title: "Please upload at least one file",
        variant: "destructive",
      });
      return;
    }

    if (characterCount > 100000) {
      toast({
        title: "Character count exceeds the limit of 100,000 characters",
        variant: "destructive",
      });
      return;
    }

    // creating formData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("characterCount", characterCount.toString());
    for (const file of files) {
      formData.append("files", file);
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/create-chatbot", {
        method: "POST",
        body: formData,
      });
      const data: ApiResponseType = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error creating chatbot: ", error);
      toast({
        title: "Chatbot Creation Failed",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
    },
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-3xl font-bold mt-10">Data Sources</h1>
            <p className="text-sm text-gray-500">Add your data sources to train your chatbot</p>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chatbot Name</FormLabel>
                <FormControl>
                  <Input placeholder="Solute Labs Chatbot" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row items-center justify-evenly w-full min-h-[45vh] md: m-4">
            <div className="flex justify-end items-center">
              <FileUploader
                value={files}
                onValueChange={setFiles}
                dropzoneOptions={dropZoneConfig}
                className="relative bg-background rounded-lg p-2 border border-black w-[500px] border-dashed md:m-4"
              >
                <FileInput className="outline-dashed outline-1 outline-white">
                  <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <FileSvgDraw />
                  </div>
                </FileInput>
                <FileUploaderContent>
                  {files &&
                    files.length > 0 &&
                    files.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{file.name}</span>
                      </FileUploaderItem>
                    ))}
                </FileUploaderContent>
              </FileUploader>
              {/* <Input type="file" multiple={true} accept=".pdf, .docx, .doc, .txt" onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setFiles(Array.from(files));
                }
              }} /> */}
            </div>
            <div className="flex flex-col justify-center items-start border rounded-sm p-6 md:m-4 w-1/3 md:w-full">
              <h2 className="text-lg font-semibold">Sources</h2>
              <p>Total detected characters: <span className="text-bold text-sm text-gray-500">{characterCount}/100,000 limit</span></p>
              <Button type="submit" disabled={isSubmitting} className='w-full mt-4'>
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Chatbot
                    </>
                  ) : ("Create Chatbot")
                }
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FileUploaderTest;
