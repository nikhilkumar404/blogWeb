import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, RTE } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const [contentTooLong, setContentTooLong] = useState(false);

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    if (data.content && data.content.length > 1000) {
      data.content = data.content.substring(0, 1000);
    }

    if (post) {
      const file =
        data.image && data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file =
        data.image && data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
      if (name === "content") {
        setContentTooLong(value.content && value.content.length > 1000);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full max-w-6xl mx-auto p-4">
      {/* Layout: Two Column Inputs */}
      <div className="flex gap-8 flex-wrap mb-6">
        {/* Left Column */}
        <div className="flex-1 min-w-[300px] space-y-6">
          {/* Title */}
          <div className="flex items-center gap-4">
            <label htmlFor="title" className="w-32 font-semibold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Title"
              className="flex-1 h-10 px-3 py-2 rounded border"
              {...register("title", { required: true })}
            />
          </div>

          {/* Featured Image */}
          <div className="flex items-center gap-4">
            <label htmlFor="image" className="w-32 font-semibold">
              Featured Image:
            </label>
            <input
              id="image"
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              className="flex-1 h-10 px-3 py-2 rounded border"
              {...register("image", { required: !post })}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-[300px] space-y-6">
          {/* Slug */}
          <div className="flex items-center gap-4">
            <label htmlFor="slug" className="w-32 font-semibold">
              Slug:
            </label>
            <input
              type="text"
              id="slug"
              placeholder="Enter Slug"
              className="flex-1 h-10 px-3 py-2 rounded border"
              {...register("slug", { required: true })}
              onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                });
              }}
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <label htmlFor="status" className="w-32 font-semibold">
              Status:
            </label>
            <select
              id="status"
              className="flex-1 h-10 px-3 py-2 rounded border"
              {...register("status", { required: true })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Field */}
      <div className="mb-4">
        
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
        {contentTooLong && (
          <p className="text-yellow-600 text-sm mt-1">
            Warning: Content is longer than 1000 characters and will be truncated on submit.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-6 text-right">
        <Button className="w-1/2" type="submit" bgColor={post ? "bg-green-500" : undefined}>
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
