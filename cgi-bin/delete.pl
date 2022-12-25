#!/usr/bin/perl

use DBI;
use CGI;
use strict;
use warnings;

## borramos elemento seleccionado

my $q = CGI->new;
my $owner = $q->param('usuario');
my $titulo = $q->param('titulo');

my $user= 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.6";
my $dbh = DBI->connect($dsn, $user, $password) or die ("No se puede conectar");

# consultamos la pagina
my $sth = $dbh->prepare("SELECT * FROM Articles WHERE owner=? AND title=?");
$sth->execute($owner,$titulo);
my @row = $sth->fetchrow_array;

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if (!(@row == 0)){
	# si existe una pagina con el usuario y titulo...

	my $sth = $dbh->prepare("DELETE FROM Articles WHERE owner=? AND title=?");
	$sth->execute($owner,$titulo);
	$sth->finish;

	print "<article>";
	print "<owner>$owner</owner>";
	print "<title>$titulo</title>";
	print "</article>";
}
else {
	print "<article>";
	print "<owner></owner>";
	print "<title></title>";
	print "</article>";
	
}
$dbh->disconnect;