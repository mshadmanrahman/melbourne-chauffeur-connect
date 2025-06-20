
-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, license_number, vehicle_details, experience)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName', 
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'licenseNumber',
    NEW.raw_user_meta_data->>'vehicleDetails',
    NEW.raw_user_meta_data->>'experience'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;
