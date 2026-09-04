import { decode } from "@msgpack/msgpack";

export const decodeMessage = (
    payload: unknown,
    label = "Data"
): any => {
    if (payload == null) return null;
    try {
        if (payload instanceof ArrayBuffer) {
            return decode(new Uint8Array(payload));
        }

        if (ArrayBuffer.isView(payload)) {
            return decode(
                new Uint8Array(
                    payload.buffer,
                    payload.byteOffset,
                    payload.byteLength
                )
            );
        }

        if (
            typeof payload === "object" &&
            payload !== null &&
            "type" in payload &&
            "data" in payload
        ) {
            const bufferPayload = payload as {
                type?: string;
                data?: number[];
            };

            if (
                bufferPayload.type === "Buffer" &&
                Array.isArray(bufferPayload.data)
            ) {
                return decode(
                    new Uint8Array(bufferPayload.data)
                );
            }
        }

        if (Array.isArray(payload)) {
            return decode(
                new Uint8Array(payload as number[])
            );
        }

        if (typeof payload === "string") {
            try {
                return JSON.parse(payload);
            } catch {
                return payload;
            }
        }

        return payload;
    } catch (error) {
        console.error(
            `Decode Error [${label}]:`,
            error
        );

        return null;
    }
};