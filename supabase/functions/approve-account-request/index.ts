// supabase/functions/approve-account-request/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle preflight request for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { request_id } = await req.json();

    // Create admin client to access data protected by RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Get applicant data from account_requests table
    const { data: requestData, error: requestError } = await supabaseAdmin
      .from("account_requests")
      .select("nama_lengkap, npm, jurusan, email")
      .eq("id", request_id)
      .single();

    if (requestError) throw requestError;

    // 2. Create a new user & send an invitation email
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        requestData.email,
        { data: { role: 'programmer' } } // Set default role on invitation
    );
    if (inviteError) throw inviteError;
    const newUser = inviteData.user;

    // 3. Create a new entry in the profiles table
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: newUser.id,
      nama_lengkap: requestData.nama_lengkap,
      npm: requestData.npm,
      jurusan: requestData.jurusan,
      email: requestData.email,
      role: 'programmer', // Ensure the role is consistent
    });
    if (profileError) throw profileError;

    // 4. Update the request status to 'approved'
    const { error: updateError } = await supabaseAdmin
      .from("account_requests")
      .update({ status: "approved" })
      .eq("id", request_id);
    if (updateError) throw updateError;

    return new Response(JSON.stringify({ message: "User approved and invited successfully!" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
