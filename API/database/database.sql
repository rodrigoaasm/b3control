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
