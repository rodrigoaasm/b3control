CREATE TABLE asset (
	id 			serial NOT NULL,
	code 		varchar(8) NOT NULL,
	social 		varchar(50) NOT NULL,
	logo 		varchar(100) NULL,
	category 	varchar(20) NOT NULL,
	CONSTRAINT asset_pkey PRIMARY KEY (id)
);

CREATE TABLE operation (
	id 			serial NOT NULL,
	value 		float NOT NULL,
	quantity 	int NOT NULL,
	"type" 		varchar(5) NOT NULL,
	asset_id 	int NOT NULL,
	created_at 	timestamp NOT NULL,
	CONSTRAINT operation_pkey PRIMARY KEY (id),
	CONSTRAINT operation_assetid_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id)
);

CREATE TABLE public.asset_quote (
	id 				serial NOT NULL,
	asset_id 	int8 NOT NULL,
	price 		numeric(10, 3) NOT NULL,
	"date" 		timestamp NOT NULL,
	CONSTRAINT 	assetquote_pkey PRIMARY KEY (id),
	CONSTRAINT  assetquote_asset_id_fkey FOREIGN KEY ("asset_id") REFERENCES public.asset(id)
);

CREATE TABLE public.dividend_payment (
	id 				serial NOT NULL,
	asset_id 	int8 NOT NULL,
	value 		numeric(10, 3) NOT NULL,
	"date" 		timestamp NOT NULL,
	CONSTRAINT  dividend_payment_pkey PRIMARY KEY (id),
	CONSTRAINT  dividend_payment_asset_id_fkey FOREIGN KEY ("asset_id") REFERENCES public.asset(id)
);
