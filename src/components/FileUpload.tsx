"use client"

import { uploadToCloudinary } from '@/lib/upload';
import { useMutation } from '@tanstack/react-query';
import { Ellipsis, Inbox, Loader, Upload } from 'lucide-react';
import React, { useState } from 'react'
import { useDropzone } from "react-dropzone";
import { toast } from "sonner"
import axios from "axios";
import { useRouter } from 'next/navigation';

const FileUpload = () => {
    const router = useRouter();

    const { mutate, } = useMutation({
        mutationFn: async ({ public_id, secure_url }: { public_id: string, secure_url: string }) => {
            const res = await axios.post("/api/create-chat", {
                public_id, pdf_url: secure_url
            })

            return res.data
        }
    })

    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles[0].size > 10 * 1024 * 1024) {
                alert("Please upload a smaller file")
            }
            setIsUploading(true);

            try {
                const file = await uploadToCloudinary(acceptedFiles[0]);

                if (file) {
               
                    // send the uploaded file to backend
                    mutate(file, {
                        onSuccess: ({chat_id}) => {
                            console.log(chat_id);
                            toast(`Uploaded Successfully`, {
                                icon: <Upload className='w-4 h-4' />
                            })
                            setIsUploading(false);
                            router.push(`/chat/${chat_id}`)
                        },
                        onError: (data) => {
                            console.log(data);
                            toast.error("File Upload Failed");
                            setIsUploading(false);
                        }
                    });
                    
                } else {
                    toast.error("File Upload Failed");
                    setIsUploading(false);
                }
            } catch (err) {
                console.log(err);
                setIsUploading(false);
                toast.error("something went wrong. try again later")
            }
        }
    });

    return (
        <div className='p-2 bg-white rounded-xl'>
            {
                isUploading ? (
                    <div className='border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 py-16 flex justify-center items-center flex-col'>
                        <Loader className='w-10 h-10 animate-spin antialiased duration-1000' />
                        uploading
                    </div>
                ) : (
                    <div {...getRootProps({
                        className: "border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
                    })}>
                        <input {...getInputProps()} disabled={isUploading} />
                        <>
                            <Inbox className='w-10 h-10 text-black' />
                            <p className='mt-2 text-sm text-slate-400'>
                                Drop PDF Here
                            </p>
                        </>
                    </div>
                )
            }
        </div >
    )
}

export default FileUpload