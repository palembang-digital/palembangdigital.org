"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewCertificateForm({ events }: { events: any[] }) {
  const [selectedEventID, setSelectedEventID] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any>(null);

  useEffect(() => {
    if (selectedEventID) {
      fetch(`/api/v1/events/${selectedEventID}`)
        .then((res) => res.json())
        .then((data) => setSelectedEvent(data.data));
    }
  }, [selectedEventID]);

  const handleGenerate = async () => {
    // Payload: {"eventId": 130, "username": "derymars", "role": "Pembicara", "template": "sdc-2024"}

    const speakers = selectedEvent.eventsSpeakers.map((speaker: any) => ({
      eventId: selectedEvent.id,
      username: speaker.user.username,
      role: "Pembicara",
      template: "default",
    }));
    const committees = selectedEvent.eventsCommittees.map((committee: any) => ({
      eventId: selectedEvent.id,
      username: committee.user.username,
      role: "Panitia",
      template: "default",
    }));
    const attendees = selectedEvent.eventsAttendees
      .filter((attendee: any) => attendee.attended)
      .map((attendee: any) => ({
        eventId: selectedEvent.id,
        username: attendee.user.username,
        role: "Peserta",
        template: "default",
      }));

    const recipients = [...speakers, ...committees, ...attendees];
    setRecipients(recipients);
    console.log(recipients);

    let completed = 0;

    for (const recipient of recipients) {
      try {
        const response = await fetch("/api/v1/certificates", {
          method: "POST",
          body: JSON.stringify(recipient),
        });
        const data = await response.json();
        if (data.message === "Certificate created") {
          completed += 1;
        }
      } catch (error) {
        console.error(error);
      }
    }

    setCompleted(completed);
  };

  return (
    <div>
      <Select onValueChange={setSelectedEventID}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih event" />
        </SelectTrigger>
        <SelectContent>
          {events.map((event) => (
            <SelectItem key={event.id} value={event.id}>
              #{event.id} - {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedEvent && (
        <div className="mt-4">
          <div className="flex flex-row gap-8">
            <div>
              <p className="text-sm font-bold">Pembicara</p>
              <ol className="list-decimal">
                {selectedEvent.eventsSpeakers
                  .sort((a: any, b: any) =>
                    a.user.name.localeCompare(b.user.name)
                  )
                  .map((speaker: any) => (
                    <li key={speaker.user.id} className="text-xs">
                      <Link href={`/users/${speaker.user.username}`}>
                        {speaker.user.name}
                      </Link>
                    </li>
                  ))}
              </ol>
            </div>
            <div>
              <p className="text-sm font-bold">Panitia</p>
              <ol className="list-decimal">
                {selectedEvent.eventsCommittees
                  .sort((a: any, b: any) =>
                    a.user.name.localeCompare(b.user.name)
                  )
                  .map((committee: any) => (
                    <li key={committee.user.id} className="text-xs">
                      <Link href={`/users/${committee.user.username}`}>
                        {committee.user.name}
                      </Link>
                    </li>
                  ))}
              </ol>
            </div>
            <div>
              <p className="text-sm font-bold">Peserta</p>
              <ol className="list-decimal">
                {selectedEvent.eventsAttendees
                  .filter((attendee: any) => attendee.attended)
                  .sort((a: any, b: any) =>
                    a.user.name.localeCompare(b.user.name)
                  )
                  .map((attendee: any) => (
                    <li key={attendee.user.id} className="text-xs">
                      <Link href={`/users/${attendee.user.username}`}>
                        {attendee.user.name}
                      </Link>
                    </li>
                  ))}
              </ol>
            </div>
          </div>

          <div className="mt-4">
            <Button size="sm" onClick={handleGenerate}>
              Generate
            </Button>
          </div>

          {completed && (
            <div className="mt-4">
              <p className="text-sm font-bold">Completed</p>
              <p className="text-xs">
                {completed} / {recipients.length}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
