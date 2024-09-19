# lexical-rich-editor
A full-fledged rich text editor package built on top of Lexical.
# Usage
> Note: The usage example provided here has been modified to suit our specific project needs. Adjust the configurations as necessary to fit your requirements.
```
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
```
