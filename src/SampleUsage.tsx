import React, { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { EditorStateChangePayload, LexicalRichText } from "nomion-rich-editor";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import FormItemTitle from "./FormItemTitle";
import { FormItem } from "@/types/formItem";
import { useUploadMutation } from "@/hooks/useUpload";
import Compressor from "compressorjs";

interface Props extends FormItem {
  className?: string;
}

const URL_PREFIX = "https://storage.googleapis.com";

const SampleUsage = (props: Props) => {
  const {
    className = "",
    name,
    title,
    required,
    note,
    disabled = false,
  } = props;
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const methods = useFormContext();
  // const a = methods.watch(name) as EditorStateChangePayload;
  // const htmlContent = a?.htmlContent;
  const { trigger, isMutating } = useUploadMutation(
    "/upload-media?directory=blog"
  );

  const uploadFile = async (file: File) => {
    const data = await trigger(file);
    return data?.urls;
  };

  const handleUpload = async (file: File) => {
    const uploadResult = await new Promise<string[]>(
      async (resolve, reject) => {
        if (file.type.includes("video")) {
          const urls = await uploadFile(
            new File([file], file.name, {
              type: `image/${file.name.split(".").pop()}`,
            })
          );
          resolve(urls);
          return;
        }
        return new Compressor(file, {
          maxHeight: 2048,
          maxWidth: 2048,
          convertSize: 200000,
          async success(fileCompressed: any) {
            try {
              const urls = await uploadFile(
                new File([fileCompressed], file.name, {
                  type: `image/${file.name.split(".").pop()}`,
                })
              );
              resolve(urls);
            } catch (e) {
              reject(e);
            }
          },
        });
      }
    );
    const relativePath = uploadResult?.[0];
    const finalResult = `${URL_PREFIX}${relativePath}`;
    return finalResult;
  };

  const handleEditorStateChange = useCallback(
    (
      editorState: EditorStateChangePayload,
      formField: ControllerRenderProps<FieldValues, string>
    ) => {
      formField.onChange(editorState);
    },
    []
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsRendered(true);
    }, 1000);
    () => clearTimeout(timerId);
  }, []);

  if (!isRendered) return null;

  return (
    <div className="w-full h-full">
      <FormItemTitle title={title} required={required} note={note} />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className={twMerge("h-fit w-full", className)}>
          <Controller
            key={name}
            name={name}
            control={methods.control}
            render={({ field }) => {
              return (
                <>
                  <LexicalRichText
                    className={twMerge(
                      "text-md max-h-[1000px] min-h-[1000px] rounded-b-lg border-neutral-400"
                      // false && "rounded-t-lg bg-neutral-50 cursor-not-allowed",
                    )}
                    toolbarClassName="text-md rounded-t-lg border-neutral-400 border-b-0"
                    initialState={field?.value?.serializedState}
                    onEditorStateChange={(stateChangePayload) =>
                      handleEditorStateChange(stateChangePayload, field)
                    }
                    toolbarConfigs={{
                      hasImage: true,
                      hasVideo: true,
                      hasHeading: true,
                      hasLink: true,
                      hasList: true,
                      hasAlignment: true,
                      imageFullWidth: true,
                    }}
                    editable={!false}
                    uploadFile={(file) => handleUpload(file)}
                    controlledState={false}
                  />
                </>
              );
            }}
          />
        </div>
      </div>
      {/*<div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>*/}
    </div>
  );
};

export default SampleUsage;
