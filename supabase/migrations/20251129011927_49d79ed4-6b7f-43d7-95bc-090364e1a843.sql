-- Corregir funciones sin search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_commission(
  _amount NUMERIC,
  _commission_percent NUMERIC
)
RETURNS TABLE (
  creator_amount NUMERIC,
  platform_amount NUMERIC
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT
    ROUND(_amount * (1 - _commission_percent / 100), 4) AS creator_amount,
    ROUND(_amount * (_commission_percent / 100), 4) AS platform_amount;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_audit_event(
  _entity_type VARCHAR,
  _entity_id UUID,
  _action VARCHAR,
  _actor_id UUID,
  _prev_state JSONB DEFAULT NULL,
  _new_state JSONB DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id UUID;
  _hash VARCHAR(256);
BEGIN
  _hash := encode(sha256((_entity_type || _entity_id::text || _action || NOW()::text)::bytea), 'hex');
  
  INSERT INTO public.audit_logs (entity_type, entity_id, action, actor_id, prev_state, new_state, bookpi_hash, metadata)
  VALUES (_entity_type, _entity_id, _action, _actor_id, _prev_state, _new_state, _hash, _metadata)
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;