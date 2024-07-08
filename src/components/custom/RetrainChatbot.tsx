"use client";

import React, { useEffect, useState } from 'react'
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from '../extension/file-uploader';
import { Loader2, Paperclip } from 'lucide-react';
import convertToMB from '@/lib/convertToMB';
import { Button } from '../ui/button';
import { maxTotalFileSize } from '@/lib/utils';
import { Separator } from "@/components/ui/separator"
import { FileSvgDraw } from "@/components/icons/Icons";
import { toast } from 'sonner';
import { UploadedFileItem } from './UploadedFileItem';


export interface FileData {
    fileId: string;
    fileName: string;
    fileSize: number;
}


const RetrainChatbot = ({ chatbotId }: { chatbotId: string }) => {

    const [files, setFiles] = useState<File[] | null>([]);
    const [includedFiles, setIncludedFiles] = useState<FileData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalFileSize, setTotalFileSize] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: maxTotalFileSize,
        multiple: true,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/msword": [".doc"],
            "text/plain": [".txt"],
        },
    };

    useEffect(() => {
        const getFiles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/get-files/${chatbotId}`);
                const result = await response.json();
                setIncludedFiles(result.data)
                setTotalFileSize(result.data.reduce((acc: number, file: FileData) => acc + file.fileSize, 0));
            } catch (error) {
                console.log("Error fetching files: ", error)
                toast.error("Error fetching uploaded files")
            } finally {
                setIsLoading(false);
            }
        }
        getFiles();

    }, [])

    useEffect(() => {
        if (files && files?.length !== 0) {
            files.forEach((file) => {
                setTotalFileSize(totalFileSize => totalFileSize + file.size);
            })
        }
        else {
            setTotalFileSize(includedFiles.reduce((acc: number, file: FileData) => acc + file.fileSize, 0));
        }
    }, [files])

    const fileDeleteHandler = async (fileId: string) => {
        const oldFiles = [...includedFiles];
        setIncludedFiles(includedFiles.filter((file) => file.fileId !== fileId));
        setIsLoading(true);
        try {
            const response = await fetch(`/api/delete-file`, {
                method: "DELETE",
                body: JSON.stringify({ chatbotId, fileId }),
            });
            const result = await response.json();
            toast.success("File deleted successfully")
        } catch (error) {
            setIncludedFiles(oldFiles);
            console.log("Error deleting file: ", error)
            toast.error("Error deleting file")
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between w-full min-h-[60vh] ">
            <div className="flex justify-end items-center">
                <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-background rounded-lg p-2 border border-black w-[500px] min-h-[27vh] border-dashed"
                >
                    <FileInput className="flex items-center justify-center h-full outline-dashed outline-1 outline-white">
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

                        <Separator className='bg-gray-500' />
                        <p className='text-gray-500 text-center'> Already Included Files</p>
                        {/* <Separator className='bg-gray-500' /> */}
                        {includedFiles && !isLoading &&
                            includedFiles.length > 0 &&
                            includedFiles.map((file, i) => (
                                <UploadedFileItem key={file.fileId} index={i} onDelete={async () => {
                                    await fileDeleteHandler(file.fileId);
                                }} >
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span>{file.fileName}</span>
                                </UploadedFileItem>
                            ))
                        }
                        {isLoading && <Loader2 className="h-4 animate-spin w-full" />}
                    </FileUploaderContent>
                </FileUploader>
            </div>
            <div className="flex flex-col justify-center items-start border rounded-sm p-6 w-1/3">
                <h2 className="text-lg font-semibold">Sources</h2>
                <p>Total file size: <span className="text-bold text-sm text-gray-5000">{convertToMB(totalFileSize)}{" "}MB/ {convertToMB(maxTotalFileSize)}{" "}MB</span></p>
                <Button type="submit" disabled={isSubmitting || isLoading} className='w-full mt-4'>
                    {
                        isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Retraining Chatbot
                            </>
                        ) : ("Retrain Chatbot")
                    }
                </Button>
            </div>
        </div>
    )
}

export default RetrainChatbot