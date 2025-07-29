"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Trash, Download, Plus, Eye, Pencil, X } from "lucide-react";
import JSZip from "jszip";

interface Avatar {
  id: string;
  name: string;
  description: string;
  speaking_url: string;
  created_at: string;
  voice_id: string;
}

export default function AvatarManager() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);
  const [newAvatar, setNewAvatar] = useState({
    name: "",
    description: "",
    voice_id: "",
  });
  const [selectedSpeakingFile, setSelectedSpeakingFile] = useState<File | null>(
    null
  );
  const supabase = createClient();

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      const { data, error } = await supabase
        .from("avatars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAvatars(data || []);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      toast.error("Failed to fetch avatars");
    }
  };

  const handleEdit = (avatar: Avatar) => {
    setEditingAvatar(avatar);
    setIsEditDialogOpen(true);
  };

  const handleSpeakingFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedSpeakingFile(file);
    }
  };

  const validateEditForm = () => {
    if (!editingAvatar?.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!editingAvatar?.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!editingAvatar?.voice_id.trim()) {
      toast.error("Voice ID is required");
      return false;
    }
    // Check if speaking URL exists and no new file is selected
    if (!editingAvatar?.speaking_url && !selectedSpeakingFile) {
      toast.error("Speaking file is required");
      return false;
    }
    // Validate new file if selected
    if (selectedSpeakingFile && !selectedSpeakingFile.name) {
      toast.error("Invalid speaking file selected");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!newAvatar.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!newAvatar.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!selectedSpeakingFile) {
      toast.error("At least one file is required for speaking state");
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        // cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAddAvatar = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload speaking file
      if (!selectedSpeakingFile) {
        toast.error("No speaking file selected");
        return;
      }
      const speakingUrl = await uploadFile(selectedSpeakingFile);
      setUploadProgress(100);

      // Create avatar record
      const { error: insertError } = await supabase.from("avatars").insert({
        name: newAvatar.name.trim(),
        description: newAvatar.description.trim(),
        speaking_url: speakingUrl,
        voice_id: newAvatar.voice_id,
      });

      if (insertError) throw insertError;

      toast.success("Avatar created successfully");
      setIsAddDialogOpen(false);
      setNewAvatar({ name: "", description: "", voice_id: "" });
      setSelectedSpeakingFile(null);
      fetchAvatars();
    } catch (error) {
      console.error("Error creating avatar:", error);
      toast.error("Failed to create avatar");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUpdateAvatar = async () => {
    console.log("editingAvatar", editingAvatar);

    if (!editingAvatar || !validateEditForm()) return;

    // Only set uploading state if there's a new file
    if (selectedSpeakingFile) {
      setIsUploading(true);
      setUploadProgress(0);
    }

    try {
      let newSpeakingUrl = editingAvatar.speaking_url;

      // Only upload new speaking file if one is selected
      if (selectedSpeakingFile) {
        newSpeakingUrl = await uploadFile(selectedSpeakingFile);
        setUploadProgress(100);
      }

      // Update avatar record
      const { error: updateError } = await supabase
        .from("avatars")
        .update({
          name: editingAvatar.name.trim(),
          description: editingAvatar.description.trim(),
          speaking_url: newSpeakingUrl,
          voice_id: editingAvatar.voice_id,
        })
        .eq("id", editingAvatar.id);

      if (updateError) throw updateError;

      toast.success("Avatar updated successfully");
      setIsEditDialogOpen(false);
      setEditingAvatar(null);
      setSelectedSpeakingFile(null);
      fetchAvatars();
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar");
    } finally {
      if (selectedSpeakingFile) {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleViewAvatar = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setIsViewDialogOpen(true);
  };

  const handleDownloadAll = async (avatar: Avatar) => {
    try {
      // Create a zip file containing all avatar files
      const zip = new JSZip();

      // Download and add speaking file
      const response = await fetch(avatar.speaking_url);
      const blob = await response.blob();
      const fileName = avatar.speaking_url.split("/").pop() || "file";
      zip.file(fileName, blob);

      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${avatar.name}-files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading files:", error);
      toast.error("Failed to download files");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // First get the avatar to get its URLs
      const { data: avatar, error: fetchError } = await supabase
        .from("avatars")
        .select("speaking_url")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Delete all files from storage
      const fileName = avatar.speaking_url.split("/").pop() || "file";

      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from("avatars")
          .remove(fileName);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from("avatars")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      toast.success("Avatar and all associated files deleted successfully");
      fetchAvatars();
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error("Failed to delete avatar and its files");
    } finally {
      setFileToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mt-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Avatar
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Voice ID</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {avatars.map((avatar) => (
            <TableRow key={avatar.id}>
              <TableCell>{avatar.name}</TableCell>
              <TableCell>{avatar.description}</TableCell>
              <TableCell>{avatar.voice_id}</TableCell>
              <TableCell>
                {new Date(avatar.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewAvatar(avatar)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(avatar)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownloadAll(avatar)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFileToDelete(avatar.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Avatar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newAvatar.name}
                onChange={(e) =>
                  setNewAvatar({ ...newAvatar, name: e.target.value })
                }
                placeholder="Enter avatar name"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newAvatar.description}
                onChange={(e) =>
                  setNewAvatar({ ...newAvatar, description: e.target.value })
                }
                placeholder="Enter avatar description"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voice_id">Voice ID *</Label>
              <Input
                id="voice_id"
                value={newAvatar.voice_id}
                onChange={(e) =>
                  setNewAvatar({ ...newAvatar, voice_id: e.target.value })
                }
                placeholder="Enter voice ID"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speaking-files">
                Speaking Files (Max 50MB) *
              </Label>
              <Input
                id="speaking-files"
                type="file"
                multiple
                onChange={handleSpeakingFileSelect}
                className="max-w-sm"
                disabled={isUploading}
              />
              {selectedSpeakingFile && (
                <p className="text-sm text-muted-foreground">
                  {selectedSpeakingFile.name} selected
                </p>
              )}
            </div>
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAvatar} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Create Avatar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Avatar Details</DialogTitle>
          </DialogHeader>
          {selectedAvatar && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Name</h3>
                <p>{selectedAvatar.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{selectedAvatar.description}</p>
              </div>
              <div>
                <h3 className="font-semibold">Voice ID</h3>
                <p>{selectedAvatar.voice_id}</p>
              </div>
              <div>
                <h3 className="font-semibold">Speaking File</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="relative aspect-square">
                    <div className="relative aspect-square">
                      <object
                        data={selectedAvatar.speaking_url}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          window.open(selectedAvatar.speaking_url, "_blank")
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAvatar(null);
            setSelectedSpeakingFile(null);
          }
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Avatar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editingAvatar?.name || ""}
                onChange={(e) =>
                  setEditingAvatar((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                placeholder="Enter avatar name"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={editingAvatar?.description || ""}
                onChange={(e) =>
                  setEditingAvatar((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                placeholder="Enter avatar description"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-voice_id">Voice ID *</Label>
              <Input
                id="edit-voice_id"
                value={editingAvatar?.voice_id || ""}
                onChange={(e) =>
                  setEditingAvatar((prev) =>
                    prev ? { ...prev, voice_id: e.target.value } : null
                  )
                }
                placeholder="Enter voice ID"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-speaking-files">
                Speaking Files (Max 50MB)
              </Label>
              <Input
                id="edit-speaking-files"
                type="file"
                multiple
                onChange={handleSpeakingFileSelect}
                className="max-w-sm"
                disabled={isUploading}
              />
              {selectedSpeakingFile && (
                <p className="text-sm text-muted-foreground">
                  {selectedSpeakingFile.name} selected
                </p>
              )}
              {editingAvatar?.speaking_url && (
                <div className="mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative aspect-square">
                      <object
                        data={editingAvatar?.speaking_url}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          setEditingAvatar({
                            ...editingAvatar,
                            speaking_url: "",
                          })
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateAvatar} disabled={isUploading}>
              {isUploading ? "Updating..." : "Update Avatar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={() => setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              avatar and all its associated files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => fileToDelete && handleDelete(fileToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
