import { createClient } from '@supabase/supabase-js';

async function setupTracking() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Delete any existing tracking chat
  await supabase
    .from('chats')
    .delete()
    .eq('id', '00000000-0000-0000-0000-000000000000');

  // Create the tracking chat
  const { error } = await supabase
    .from('chats')
    .insert({
      id: '00000000-0000-0000-0000-000000000000',
      title: 'Message Tracking',
      user_email: 'system',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error creating tracking chat:', error);
    process.exit(1);
  }

  console.log('Tracking chat created successfully');
}

setupTracking().catch(console.error);
