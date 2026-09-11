"use server";
import { CardType, CardStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { CardProvisioningService } from "@/services/card-provisioning.service";
import { prisma } from "@/lib/prisma";
export async function createCard(formData:FormData){await requireAdmin();const type=String(formData.get("type"));if(!["EXPRESS","CUSTOM","BUSINESS"].includes(type))redirect("/admin/cards/new");const created=await CardProvisioningService.create({type:type as CardType,email:String(formData.get("email")||"")||undefined,phone:String(formData.get("phone")||"")||undefined});redirect(`/admin/cards/${created.card.slug}?password=${encodeURIComponent(created.temporaryPassword)}`)}
export async function updateCardStatus(formData:FormData){await requireAdmin();const id=String(formData.get("id"));const status=String(formData.get("status"));if(!["ACTIVE","SUSPENDED","INACTIVE"].includes(status))return;await prisma.card.update({where:{id},data:{status:status as CardStatus}});revalidatePath("/admin/cards");}
